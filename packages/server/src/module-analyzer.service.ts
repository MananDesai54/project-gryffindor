import { OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

export class ModuleAnalyzerService implements OnModuleInit {
  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    this.analyzeModules();
  }

  private analyzeModules() {
    console.log('🔍 Analyzing NestJS module structure...');

    // Get all providers
    const providers = this.moduleRef['container']?.getModules?.();

    if (providers) {
      console.log('📦 Registered modules:');
      providers.forEach((module, key) => {
        console.log(`  - ${key}`);

        // Check providers in each module
        const moduleProviders = module.providers;
        if (moduleProviders && moduleProviders.size > 0) {
          console.log(`    Providers:`);
          moduleProviders.forEach((provider, providerKey) => {
            console.log(`      - ${providerKey as any}`);
          });
        }
      });
    }
  }
}
